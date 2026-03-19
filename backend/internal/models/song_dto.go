package models

type CreateSongRequest struct {
	Title       string  `json:"title" binding:"required"`
	ArtistName  string  `json:"artist_name" binding:"required"`
	Genre       string  `json:"genre"`
	BPM         int     `json:"bpm"`
	SongKey     string  `json:"song_key"`
	DateWritten *string `json:"date_written"`
}

type UpdateSongRequest struct {
	Title       string  `json:"title" binding:"required"`
	ArtistName  string  `json:"artist_name" binding:"required"`
	Genre       string  `json:"genre"`
	BPM         int     `json:"bpm"`
	SongKey     string  `json:"song_key"`
	DateWritten *string `json:"date_written"`
}
