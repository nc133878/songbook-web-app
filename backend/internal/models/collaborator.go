package models

type Collaborator struct {
	ID             int     `json:"id"`
	SongID         int     `json:"song_id"`
	Name           string  `json:"name"`
	Role           string  `json:"role"`
	WriterSplit    float64 `json:"writer_split"`
	PublisherSplit float64 `json:"publisher_split"`
	MasterSplit    float64 `json:"master_split"`
	PRO            string  `json:"pro"`
	IPINumber      string  `json:"ipi_number"`
	PublisherName  string  `json:"publisher_name"`
	PublisherIPI   string  `json:"publisher_ipi"`
}

type CreateCollaboratorRequest struct {
	Name           string  `json:"name" binding:"required"`
	Role           string  `json:"role" binding:"required"`
	WriterSplit    float64 `json:"writer_split"`
	PublisherSplit float64 `json:"publisher_split"`
	MasterSplit    float64 `json:"master_split"`
	PRO            string  `json:"pro"`
	IPINumber      string  `json:"ipi_number"`
	PublisherName  string  `json:"publisher_name"`
	PublisherIPI   string  `json:"publisher_ipi"`
}

type UpdateCollaboratorRequest struct {
	Name           string  `json:"name" binding:"required"`
	Role           string  `json:"role" binding:"required"`
	WriterSplit    float64 `json:"writer_split"`
	PublisherSplit float64 `json:"publisher_split"`
	MasterSplit    float64 `json:"master_split"`
	PRO            string  `json:"pro"`
	IPINumber      string  `json:"ipi_number"`
	PublisherName  string  `json:"publisher_name"`
	PublisherIPI   string  `json:"publisher_ipi"`
}
