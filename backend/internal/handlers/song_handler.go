package handlers

import (
	"net/http"
	"strconv"
	"time"

	"songbook/internal/models"
	"songbook/internal/services"

	"github.com/gin-gonic/gin"
)

type SongHandler struct {
	songService *services.SongService
}

func NewSongHandler(songService *services.SongService) *SongHandler {
	return &SongHandler{songService: songService}
}

func (h *SongHandler) GetSongs(c *gin.Context) {
	userID := c.MustGet("userID").(int)

	songs, err := h.songService.GetSongs(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch songs"})
		return
	}

	if songs == nil {
		songs = []models.Song{}
	}

	c.JSON(http.StatusOK, songs)
}

func (h *SongHandler) GetSongByID(c *gin.Context) {
	userID := c.MustGet("userID").(int)

	idParam := c.Param("songId")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid song id"})
		return
	}

	song, err := h.songService.GetSongByID(id, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch song"})
		return
	}

	if song == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "song not found"})
		return
	}

	c.JSON(http.StatusOK, song)
}

func (h *SongHandler) CreateSong(c *gin.Context) {
	userID := c.MustGet("userID").(int)

	var req models.CreateSongRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var dateWritten *time.Time
	if req.DateWritten != nil && *req.DateWritten != "" {
		parsed, err := time.Parse("2006-01-02", *req.DateWritten)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date_written format, use YYYY-MM-DD"})
			return
		}
		dateWritten = &parsed
	}

	newSong := models.Song{
		UserID:      userID,
		Title:       req.Title,
		ArtistName:  req.ArtistName,
		Genre:       req.Genre,
		BPM:         req.BPM,
		SongKey:     req.SongKey,
		DateWritten: dateWritten,
	}

	createdSong, err := h.songService.CreateSong(newSong)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create song"})
		return
	}

	c.JSON(http.StatusCreated, createdSong)
}

func (h *SongHandler) UpdateSong(c *gin.Context) {
	userID := c.MustGet("userID").(int)

	idParam := c.Param("songId")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid song id"})
		return
	}

	var req models.UpdateSongRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var dateWritten *time.Time
	if req.DateWritten != nil && *req.DateWritten != "" {
		parsed, err := time.Parse("2006-01-02", *req.DateWritten)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date_written format, use YYYY-MM-DD"})
			return
		}
		dateWritten = &parsed
	}

	updatedInput := models.Song{
		Title:       req.Title,
		ArtistName:  req.ArtistName,
		Genre:       req.Genre,
		BPM:         req.BPM,
		SongKey:     req.SongKey,
		DateWritten: dateWritten,
	}

	updatedSong, err := h.songService.UpdateSong(id, userID, updatedInput)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update song"})
		return
	}

	if updatedSong == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "song not found"})
		return
	}

	c.JSON(http.StatusOK, updatedSong)
}

func (h *SongHandler) DeleteSong(c *gin.Context) {
	userID := c.MustGet("userID").(int)

	idParam := c.Param("songId")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid song id"})
		return
	}

	deleted, err := h.songService.DeleteSong(id, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete song"})
		return
	}

	if !deleted {
		c.JSON(http.StatusNotFound, gin.H{"error": "song not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "song deleted successfully"})
}
