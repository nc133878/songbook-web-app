package repositories

import (
	"context"
	"errors"

	"songbook/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CollaboratorRepository struct {
	db *pgxpool.Pool
}

func NewCollaboratorRepository(db *pgxpool.Pool) *CollaboratorRepository {
	return &CollaboratorRepository{
		db: db,
	}
}

func (r *CollaboratorRepository) Create(songID int, collaborator models.Collaborator) (*models.Collaborator, error) {
	query := `
		INSERT INTO collaborators (
			song_id,
			name,
			role,
			writer_split,
			publisher_split,
			master_split,
			pro,
			ipi_number,
			publisher_name,
			publisher_ipi
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, song_id, name, role, writer_split, publisher_split, master_split, pro, ipi_number, publisher_name, publisher_ipi
	`

	var created models.Collaborator

	err := r.db.QueryRow(
		context.Background(),
		query,
		songID,
		collaborator.Name,
		collaborator.Role,
		collaborator.WriterSplit,
		collaborator.PublisherSplit,
		collaborator.MasterSplit,
		collaborator.PRO,
		collaborator.IPINumber,
		collaborator.PublisherName,
		collaborator.PublisherIPI,
	).Scan(
		&created.ID,
		&created.SongID,
		&created.Name,
		&created.Role,
		&created.WriterSplit,
		&created.PublisherSplit,
		&created.MasterSplit,
		&created.PRO,
		&created.IPINumber,
		&created.PublisherName,
		&created.PublisherIPI,
	)

	if err != nil {
		return nil, err
	}

	return &created, nil
}

func (r *CollaboratorRepository) GetBySongID(songID int) ([]models.Collaborator, error) {
	query := `
		SELECT
			id,
			song_id,
			name,
			role,
			writer_split,
			publisher_split,
			master_split,
			pro,
			ipi_number,
			publisher_name,
			publisher_ipi
		FROM collaborators
		WHERE song_id = $1
		ORDER BY id ASC
	`

	rows, err := r.db.Query(context.Background(), query, songID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var collaborators []models.Collaborator

	for rows.Next() {
		var collaborator models.Collaborator

		err := rows.Scan(
			&collaborator.ID,
			&collaborator.SongID,
			&collaborator.Name,
			&collaborator.Role,
			&collaborator.WriterSplit,
			&collaborator.PublisherSplit,
			&collaborator.MasterSplit,
			&collaborator.PRO,
			&collaborator.IPINumber,
			&collaborator.PublisherName,
			&collaborator.PublisherIPI,
		)
		if err != nil {
			return nil, err
		}

		collaborators = append(collaborators, collaborator)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return collaborators, nil
}

func (r *CollaboratorRepository) GetByID(songID int, collaboratorID int) (*models.Collaborator, error) {
	query := `
		SELECT
			id,
			song_id,
			name,
			role,
			writer_split,
			publisher_split,
			master_split,
			pro,
			ipi_number,
			publisher_name,
			publisher_ipi
		FROM collaborators
		WHERE id = $1 AND song_id = $2
	`

	var collaborator models.Collaborator

	err := r.db.QueryRow(
		context.Background(),
		query,
		collaboratorID,
		songID,
	).Scan(
		&collaborator.ID,
		&collaborator.SongID,
		&collaborator.Name,
		&collaborator.Role,
		&collaborator.WriterSplit,
		&collaborator.PublisherSplit,
		&collaborator.MasterSplit,
		&collaborator.PRO,
		&collaborator.IPINumber,
		&collaborator.PublisherName,
		&collaborator.PublisherIPI,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &collaborator, nil
}

func (r *CollaboratorRepository) GetSplitTotalsBySongID(songID int) (float64, float64, float64, error) {
	query := `
		SELECT
			COALESCE(SUM(writer_split), 0),
			COALESCE(SUM(publisher_split), 0),
			COALESCE(SUM(master_split), 0)
		FROM collaborators
		WHERE song_id = $1
	`

	var writerTotal float64
	var publisherTotal float64
	var masterTotal float64

	err := r.db.QueryRow(context.Background(), query, songID).Scan(
		&writerTotal,
		&publisherTotal,
		&masterTotal,
	)

	if err != nil {
		return 0, 0, 0, err
	}

	return writerTotal, publisherTotal, masterTotal, nil
}

func (r *CollaboratorRepository) Update(songID int, collaboratorID int, collaborator models.Collaborator) (*models.Collaborator, error) {
	query := `
		UPDATE collaborators
		SET
			name = $1,
			role = $2,
			writer_split = $3,
			publisher_split = $4,
			master_split = $5,
			pro = $6,
			ipi_number = $7,
			publisher_name = $8,
			publisher_ipi = $9
		WHERE id = $10 AND song_id = $11
		RETURNING id, song_id, name, role, writer_split, publisher_split, master_split, pro, ipi_number, publisher_name, publisher_ipi
	`

	var updated models.Collaborator

	err := r.db.QueryRow(
		context.Background(),
		query,
		collaborator.Name,
		collaborator.Role,
		collaborator.WriterSplit,
		collaborator.PublisherSplit,
		collaborator.MasterSplit,
		collaborator.PRO,
		collaborator.IPINumber,
		collaborator.PublisherName,
		collaborator.PublisherIPI,
		collaboratorID,
		songID,
	).Scan(
		&updated.ID,
		&updated.SongID,
		&updated.Name,
		&updated.Role,
		&updated.WriterSplit,
		&updated.PublisherSplit,
		&updated.MasterSplit,
		&updated.PRO,
		&updated.IPINumber,
		&updated.PublisherName,
		&updated.PublisherIPI,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &updated, nil
}

func (r *CollaboratorRepository) Delete(songID int, collaboratorID int) (bool, error) {
	query := `
		DELETE FROM collaborators
		WHERE id = $1 AND song_id = $2
	`

	result, err := r.db.Exec(context.Background(), query, collaboratorID, songID)
	if err != nil {
		return false, err
	}

	return result.RowsAffected() > 0, nil
}
