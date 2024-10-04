package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"server/models"
)

func Register(c *gin.Context, db *pg.DB) {
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	exists := checkUserExist(db, user.Account)
	if exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "User already exists",
		})
		return
	}

	if _, err := db.Model(&user).Insert(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

func Login(c *gin.Context, db *pg.DB) {
	var loginUser *struct {
		Account  string `json:"account" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&loginUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	dbUser, err := getUser(db, loginUser.Account)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if loginUser.Account != dbUser.Account ||
		loginUser.Password != dbUser.Password {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid account or password",
		})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"account": dbUser.Account,
	})
	tokenString, err := token.SignedString([]byte("employee-admin"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"authorization": tokenString,
	})
}

func GetProfile(c *gin.Context, db *pg.DB) {
	account, _ := c.Get("account")
	user, err := getUser(db, account.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

func GetUsers(c *gin.Context, db *pg.DB) {
	var users []models.User
	err := db.Model(&users).
		ExcludeColumn("password").
		Select()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

func UpdateProfile(c *gin.Context, db *pg.DB) {
	var updatedData models.User
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	account := c.GetString("account")
	existingUser, err := getUser(db, account)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if updatedData.Password != "" {
		existingUser.Password = updatedData.Password
	}
	if updatedData.Name != "" {
		existingUser.Name = updatedData.Name
	}
	if updatedData.Age != 0 {
		existingUser.Age = updatedData.Age
	}
	if updatedData.Gender != "" {
		existingUser.Gender = updatedData.Gender
	}
	_, err = db.Model(&existingUser).Where("account = ?", account).Update()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": existingUser,
	})
}
