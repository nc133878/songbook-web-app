package main

import (
	"log"
	"os"

	"songbook/internal/db"
	"songbook/internal/handlers"
	"songbook/internal/repositories"
	"songbook/internal/routes"
	"songbook/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println(".env file not found, relying on system environment variables")
	}

	router := gin.Default()

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{frontendURL},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Content-Type", "Authorization"},
	}))

	dbPool, err := db.ConnectDB()
	if err != nil {
		log.Fatal("failed to connect to database:", err)
	}

	userRepo := repositories.NewUserRepository(dbPool)
	songRepo := repositories.NewSongRepository(dbPool)
	collaboratorRepo := repositories.NewCollaboratorRepository(dbPool)

	authService := services.NewAuthService(userRepo)
	songService := services.NewSongService(songRepo)
	collaboratorService := services.NewCollaboratorService(collaboratorRepo, songRepo)

	authHandler := handlers.NewAuthHandler(authService)
	songHandler := handlers.NewSongHandler(songService)
	collaboratorHandler := handlers.NewCollaboratorHandler(collaboratorService)

	routes.RegisterRoutes(router, authHandler, songHandler, collaboratorHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router.Run(":" + port)
}
