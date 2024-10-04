package models

import (
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

type Gender string

type User struct {
	Account  string `json:"account"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Age      int    `json:"age"`
	Gender   Gender `json:"gender"`
}

func CreateSchema(db *pg.DB) error {
	models := []interface{}{
		(*User)(nil),
	}
	for _, model := range models {
		err := db.Model(model).CreateTable(&orm.CreateTableOptions{
			IfNotExists: true,
		})
		if err != nil {
			return err
		}
	}
	return nil
}
