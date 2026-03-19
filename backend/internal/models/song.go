package models

import "time"

type Song struct {
	ID          int        `json:"id"`
	UserID      int        `json:"user_id,omitempty"`
	Title       string     `json:"title"`
	ArtistName  string     `json:"artist_name"`
	Genre       string     `json:"genre"`
	BPM         int        `json:"bpm"`
	SongKey     string     `json:"song_key"`
	DateWritten *time.Time `json:"date_written"`
}
