package handlers

import (
	"net/http"
	"strconv"

	"songbook/internal/models"
	"songbook/internal/services"

	"github.com/gin-gonic/gin"
)

type CollaboratorHandler struct {
	collaboratorService *services.CollaboratorService
}

func NewCollaboratorHandler(collaboratorService *services.CollaboratorService) *CollaboratorHandler {
	return &CollaboratorHandler{
		collaboratorService: collaboratorService,
	}
}

func (h *CollaboratorHandler) CreateCollaborator(c *gin.Context) {
	songIDParam := c.Param("songId")

	songID, err := strconv.Atoi(songIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid song id"})
		return
	}

	var req models.CreateCollaboratorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newCollaborator := models.Collaborator{
		Name:           req.Name,
		Role:           req.Role,
		WriterSplit:    req.WriterSplit,
		PublisherSplit: req.PublisherSplit,
		MasterSplit:    req.MasterSplit,
		PRO:            req.PRO,
		IPINumber:      req.IPINumber,
	}

	created, err := h.collaboratorService.CreateCollaborator(songID, newCollaborator)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, created)
}

func (h *CollaboratorHandler) GetCollaboratorsBySongID(c *gin.Context) {
	songIDParam := c.Param("songId")

	songID, err := strconv.Atoi(songIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid song id"})
		return
	}

	collaborators, err := h.collaboratorService.GetCollaboratorsBySongID(songID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch collaborators"})
		return
	}

	c.JSON(http.StatusOK, collaborators)
}

func (h *CollaboratorHandler) GetCollaboratorByID(c *gin.Context) {
	songIDParam := c.Param("songId")
	collaboratorIDParam := c.Param("collaboratorId")

	songID, err := strconv.Atoi(songIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid song id"})
		return
	}

	collaboratorID, err := strconv.Atoi(collaboratorIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid collaborator id"})
		return
	}

	collaborator, err := h.collaboratorService.GetCollaboratorByID(songID, collaboratorID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch collaborator"})
		return
	}

	if collaborator == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "collaborator not found for this song"})
		return
	}

	c.JSON(http.StatusOK, collaborator)
}

func (h *CollaboratorHandler) UpdateCollaborator(c *gin.Context) {
	songIDParam := c.Param("songId")
	collaboratorIDParam := c.Param("collaboratorId")

	songID, err := strconv.Atoi(songIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid song id"})
		return
	}

	collaboratorID, err := strconv.Atoi(collaboratorIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid collaborator id"})
		return
	}

	var req models.UpdateCollaboratorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedInput := models.Collaborator{
		Name:           req.Name,
		Role:           req.Role,
		WriterSplit:    req.WriterSplit,
		PublisherSplit: req.PublisherSplit,
		MasterSplit:    req.MasterSplit,
		PRO:            req.PRO,
		IPINumber:      req.IPINumber,
	}

	updated, err := h.collaboratorService.UpdateCollaborator(songID, collaboratorID, updatedInput)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if updated == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "collaborator not found for this song"})
		return
	}

	c.JSON(http.StatusOK, updated)
}

func (h *CollaboratorHandler) DeleteCollaborator(c *gin.Context) {
	songIDParam := c.Param("songId")
	collaboratorIDParam := c.Param("collaboratorId")

	songID, err := strconv.Atoi(songIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid song id"})
		return
	}

	collaboratorID, err := strconv.Atoi(collaboratorIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid collaborator id"})
		return
	}

	deleted, err := h.collaboratorService.DeleteCollaborator(songID, collaboratorID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete collaborator"})
		return
	}

	if !deleted {
		c.JSON(http.StatusNotFound, gin.H{"error": "collaborator not found for this song"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "collaborator deleted successfully"})
}

func (h *CollaboratorHandler) ValidateSplits(c *gin.Context) {
	songIDParam := c.Param("songId")

	songID, err := strconv.Atoi(songIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid song id"})
		return
	}

	result, err := h.collaboratorService.ValidateSplits(songID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to validate splits"})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *CollaboratorHandler) GetSplitSheet(c *gin.Context) {
	songIDParam := c.Param("songId")

	songID, err := strconv.Atoi(songIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid song id"})
		return
	}

	splitSheet, err := h.collaboratorService.GetSplitSheet(songID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to build split sheet"})
		return
	}

	if splitSheet == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "song not found"})
		return
	}

	c.JSON(http.StatusOK, splitSheet)
}
