package repositories

import (
	"context"
	"errors"

	"songbook/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type SongRepository struct {
	db *pgxpool.Pool
}

func NewSongRepository(db *pgxpool.Pool) *SongRepository {
	return &SongRepository{db: db}
}

func (r *SongRepository) GetAll(userID int) ([]models.Song, error) {
	query := `
		SELECT id, title, artist_name, genre, bpm, song_key, date_written
		FROM songs
		WHERE user_id = $1
		ORDER BY id ASC
	`

	rows, err := r.db.Query(context.Background(), query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var songs []models.Song

	for rows.Next() {
		var song models.Song
		err := rows.Scan(
			&song.ID,
			&song.Title,
			&song.ArtistName,
			&song.Genre,
			&song.BPM,
			&song.SongKey,
			&song.DateWritten,
		)
		if err != nil {
			return nil, err
		}
		songs = append(songs, song)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return songs, nil
}

func (r *SongRepository) GetByIDInternal(id int) (*models.Song, error) {
	query := `
		SELECT id, title, artist_name, genre, bpm, song_key, date_written
		FROM songs
		WHERE id = $1
	`

	var song models.Song
	err := r.db.QueryRow(context.Background(), query, id).Scan(
		&song.ID,
		&song.Title,
		&song.ArtistName,
		&song.Genre,
		&song.BPM,
		&song.SongKey,
		&song.DateWritten,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &song, nil
}

func (r *SongRepository) GetByID(id, userID int) (*models.Song, error) {
	query := `
		SELECT id, title, artist_name, genre, bpm, song_key, date_written
		FROM songs
		WHERE id = $1 AND user_id = $2
	`

	var song models.Song
	err := r.db.QueryRow(context.Background(), query, id, userID).Scan(
		&song.ID,
		&song.Title,
		&song.ArtistName,
		&song.Genre,
		&song.BPM,
		&song.SongKey,
		&song.DateWritten,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &song, nil
}

func (r *SongRepository) Create(song models.Song) (*models.Song, error) {
	query := `
		INSERT INTO songs (title, artist_name, genre, bpm, song_key, date_written, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, date_written
	`

	err := r.db.QueryRow(
		context.Background(),
		query,
		song.Title,
		song.ArtistName,
		song.Genre,
		song.BPM,
		song.SongKey,
		song.DateWritten,
		song.UserID,
	).Scan(&song.ID, &song.DateWritten)

	if err != nil {
		return nil, err
	}

	return &song, nil
}

func (r *SongRepository) Update(id, userID int, song models.Song) (*models.Song, error) {
	query := `
		UPDATE songs
		SET title = $1,
			artist_name = $2,
			genre = $3,
			bpm = $4,
			song_key = $5,
			date_written = $6
		WHERE id = $7 AND user_id = $8
		RETURNING id, title, artist_name, genre, bpm, song_key, date_written
	`

	var updatedSong models.Song
	err := r.db.QueryRow(
		context.Background(),
		query,
		song.Title,
		song.ArtistName,
		song.Genre,
		song.BPM,
		song.SongKey,
		song.DateWritten,
		id,
		userID,
	).Scan(
		&updatedSong.ID,
		&updatedSong.Title,
		&updatedSong.ArtistName,
		&updatedSong.Genre,
		&updatedSong.BPM,
		&updatedSong.SongKey,
		&updatedSong.DateWritten,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &updatedSong, nil
}

func (r *SongRepository) Delete(id, userID int) (bool, error) {
	query := `
		DELETE FROM songs
		WHERE id = $1 AND user_id = $2
	`

	result, err := r.db.Exec(context.Background(), query, id, userID)
	if err != nil {
		return false, err
	}

	return result.RowsAffected() > 0, nil
}

