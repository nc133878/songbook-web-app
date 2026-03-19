package services

import (
	"songbook/internal/models"
	"songbook/internal/repositories"
)

type SongService struct {
	songRepo *repositories.SongRepository
}

func NewSongService(songRepo *repositories.SongRepository) *SongService {
	return &SongService{songRepo: songRepo}
}

func (s *SongService) GetSongs(userID int) ([]models.Song, error) {
	return s.songRepo.GetAll(userID)
}

func (s *SongService) GetSongByID(id, userID int) (*models.Song, error) {
	return s.songRepo.GetByID(id, userID)
}

func (s *SongService) CreateSong(song models.Song) (*models.Song, error) {
	return s.songRepo.Create(song)
}

func (s *SongService) UpdateSong(id, userID int, song models.Song) (*models.Song, error) {
	return s.songRepo.Update(id, userID, song)
}

func (s *SongService) DeleteSong(id, userID int) (bool, error) {
	return s.songRepo.Delete(id, userID)
}
