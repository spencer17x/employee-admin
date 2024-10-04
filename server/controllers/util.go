package controllers

import (
	"github.com/go-pg/pg/v10"
	"server/models"
)

func checkUserExist(db *pg.DB, account string) bool {
	_, err := getUser(db, account)
	return err == nil
}

func getUser(db *pg.DB, account string) (models.User, error) {
	var user models.User
	err := db.Model(&user).Where("account = ?", account).Select()
	return user, err
}
