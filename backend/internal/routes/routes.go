package routes

import (
	"net/http"

	"songbook/internal/handlers"
	"songbook/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	router *gin.Engine,
	authHandler *handlers.AuthHandler,
	songHandler *handlers.SongHandler,
	collaboratorHandler *handlers.CollaboratorHandler,
) {
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "Songbook API running"})
	})

	// Public auth routes
	router.POST("/auth/register", authHandler.Register)
	router.POST("/auth/login", authHandler.Login)

	// Protected routes
	protected := router.Group("/")
	protected.Use(middleware.RequireAuth())
	{
		protected.PUT("/auth/change-password", authHandler.ChangePassword)

		protected.GET("/songs", songHandler.GetSongs)
		protected.POST("/songs", songHandler.CreateSong)
		protected.GET("/songs/id/:songId", songHandler.GetSongByID)
		protected.PUT("/songs/id/:songId", songHandler.UpdateSong)
		protected.DELETE("/songs/id/:songId", songHandler.DeleteSong)

		protected.POST("/songs/:songId/collaborators", collaboratorHandler.CreateCollaborator)
		protected.GET("/songs/:songId/collaborators", collaboratorHandler.GetCollaboratorsBySongID)
		protected.GET("/songs/:songId/collaborators/:collaboratorId", collaboratorHandler.GetCollaboratorByID)
		protected.PUT("/songs/:songId/collaborators/:collaboratorId", collaboratorHandler.UpdateCollaborator)
		protected.DELETE("/songs/:songId/collaborators/:collaboratorId", collaboratorHandler.DeleteCollaborator)
		protected.GET("/songs/:songId/splits/validate", collaboratorHandler.ValidateSplits)
		protected.GET("/songs/:songId/split-sheet", collaboratorHandler.GetSplitSheet)
	}
}
