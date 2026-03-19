package models

type SplitSheetTotals struct {
	WriterTotal    float64 `json:"writer_total"`
	PublisherTotal float64 `json:"publisher_total"`
	MasterTotal    float64 `json:"master_total"`
}

type SplitSheetValidation struct {
	WriterValid100    bool `json:"writer_valid_100"`
	PublisherValid100 bool `json:"publisher_valid_100"`
	MasterValid100    bool `json:"master_valid_100"`
}

type SplitSheetResponse struct {
	Song          *Song                `json:"song"`
	Collaborators []Collaborator       `json:"collaborators"`
	Totals        SplitSheetTotals     `json:"totals"`
	Validation    SplitSheetValidation `json:"validation"`
}
