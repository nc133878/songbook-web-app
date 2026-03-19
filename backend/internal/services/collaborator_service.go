package services

import (
	"fmt"
	"math"

	"songbook/internal/models"
	"songbook/internal/repositories"
)

type CollaboratorService struct {
	collaboratorRepo *repositories.CollaboratorRepository
	songRepo         *repositories.SongRepository
}

func NewCollaboratorService(
	collaboratorRepo *repositories.CollaboratorRepository,
	songRepo *repositories.SongRepository,
) *CollaboratorService {
	return &CollaboratorService{
		collaboratorRepo: collaboratorRepo,
		songRepo:         songRepo,
	}
}

func (s *CollaboratorService) validateCreateSplitLimits(
	songID int,
	writer float64,
	publisher float64,
	master float64,
) error {
	writerTotal, publisherTotal, masterTotal, err :=
		s.collaboratorRepo.GetSplitTotalsBySongID(songID)

	if err != nil {
		return err
	}

	if writerTotal+writer > 100 {
		return fmt.Errorf("writer splits would exceed 100%% (current total: %.0f%%, remaining: %.0f%%, attempted to add: %.0f%%)", writerTotal, 100-writerTotal, writer)
	}

	if publisherTotal+publisher > 100 {
		return fmt.Errorf("publisher splits would exceed 100%% (current total: %.0f%%, remaining: %.0f%%, attempted to add: %.0f%%)", publisherTotal, 100-publisherTotal, publisher)
	}

	if masterTotal+master > 100 {
		return fmt.Errorf("master splits would exceed 100%% (current total: %.0f%%, remaining: %.0f%%, attempted to add: %.0f%%)", masterTotal, 100-masterTotal, master)
	}

	return nil
}

func (s *CollaboratorService) validateUpdateSplitLimits(
	songID int,
	collaboratorID int,
	writer float64,
	publisher float64,
	master float64,
) error {
	existing, err := s.collaboratorRepo.GetByID(songID, collaboratorID)
	if err != nil {
		return err
	}
	if existing == nil {
		return nil
	}

	writerTotal, publisherTotal, masterTotal, err :=
		s.collaboratorRepo.GetSplitTotalsBySongID(songID)

	if err != nil {
		return err
	}

	adjustedWriterTotal := writerTotal - existing.WriterSplit + writer
	adjustedPublisherTotal := publisherTotal - existing.PublisherSplit + publisher
	adjustedMasterTotal := masterTotal - existing.MasterSplit + master

	if adjustedWriterTotal > 100 {
		return fmt.Errorf("writer splits would exceed 100%% (current total: %.0f%%, remaining: %.0f%%, attempted to add: %.0f%%)", writerTotal-existing.WriterSplit, 100-(writerTotal-existing.WriterSplit), writer)
	}

	if adjustedPublisherTotal > 100 {
		return fmt.Errorf("publisher splits would exceed 100%% (current total: %.0f%%, remaining: %.0f%%, attempted to add: %.0f%%)", publisherTotal-existing.PublisherSplit, 100-(publisherTotal-existing.PublisherSplit), publisher)
	}

	if adjustedMasterTotal > 100 {
		return fmt.Errorf("master splits would exceed 100%% (current total: %.0f%%, remaining: %.0f%%, attempted to add: %.0f%%)", masterTotal-existing.MasterSplit, 100-(masterTotal-existing.MasterSplit), master)
	}

	return nil
}

func (s *CollaboratorService) CreateCollaborator(
	songID int,
	collaborator models.Collaborator,
) (*models.Collaborator, error) {
	err := s.validateCreateSplitLimits(
		songID,
		collaborator.WriterSplit,
		collaborator.PublisherSplit,
		collaborator.MasterSplit,
	)
	if err != nil {
		return nil, err
	}

	return s.collaboratorRepo.Create(songID, collaborator)
}

func (s *CollaboratorService) GetCollaboratorsBySongID(songID int) ([]models.Collaborator, error) {
	return s.collaboratorRepo.GetBySongID(songID)
}

func (s *CollaboratorService) GetCollaboratorByID(songID int, collaboratorID int) (*models.Collaborator, error) {
	return s.collaboratorRepo.GetByID(songID, collaboratorID)
}

func (s *CollaboratorService) UpdateCollaborator(
	songID int,
	collaboratorID int,
	collaborator models.Collaborator,
) (*models.Collaborator, error) {
	err := s.validateUpdateSplitLimits(
		songID,
		collaboratorID,
		collaborator.WriterSplit,
		collaborator.PublisherSplit,
		collaborator.MasterSplit,
	)
	if err != nil {
		return nil, err
	}

	return s.collaboratorRepo.Update(songID, collaboratorID, collaborator)
}

func (s *CollaboratorService) DeleteCollaborator(songID int, collaboratorID int) (bool, error) {
	return s.collaboratorRepo.Delete(songID, collaboratorID)
}

func (s *CollaboratorService) ValidateSplits(songID int) (map[string]interface{}, error) {
	writerTotal, publisherTotal, masterTotal, err := s.collaboratorRepo.GetSplitTotalsBySongID(songID)
	if err != nil {
		return nil, err
	}

	writerRemaining := 100 - writerTotal
	publisherRemaining := 100 - publisherTotal
	masterRemaining := 100 - masterTotal

	writerValid := math.Abs(writerTotal-100) < 0.0001
	publisherValid := math.Abs(publisherTotal-100) < 0.0001
	masterValid := math.Abs(masterTotal-100) < 0.0001

	result := map[string]interface{}{
		"song_id": songID,

		"writer_total":     writerTotal,
		"writer_valid_100": writerValid,
		"writer_remaining": writerRemaining,

		"publisher_total":     publisherTotal,
		"publisher_valid_100": publisherValid,
		"publisher_remaining": publisherRemaining,

		"master_total":     masterTotal,
		"master_valid_100": masterValid,
		"master_remaining": masterRemaining,
	}

	return result, nil
}

func (s *CollaboratorService) GetSplitSheet(songID int) (*models.SplitSheetResponse, error) {
	song, err := s.songRepo.GetByIDInternal(songID)
	if err != nil {
		return nil, err
	}
	if song == nil {
		return nil, nil
	}

	collaborators, err := s.collaboratorRepo.GetBySongID(songID)
	if err != nil {
		return nil, err
	}

	writerTotal, publisherTotal, masterTotal, err := s.collaboratorRepo.GetSplitTotalsBySongID(songID)
	if err != nil {
		return nil, err
	}

	writerValid := math.Abs(writerTotal-100) < 0.0001
	publisherValid := math.Abs(publisherTotal-100) < 0.0001
	masterValid := math.Abs(masterTotal-100) < 0.0001

	response := &models.SplitSheetResponse{
		Song:          song,
		Collaborators: collaborators,
		Totals: models.SplitSheetTotals{
			WriterTotal:    writerTotal,
			PublisherTotal: publisherTotal,
			MasterTotal:    masterTotal,
		},
		Validation: models.SplitSheetValidation{
			WriterValid100:    writerValid,
			PublisherValid100: publisherValid,
			MasterValid100:    masterValid,
		},
	}

	return response, nil
}
