package main

import (
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	"server/controllers"
	"server/database"
	"server/middlewares"
)

func wrapperDB(handler func(*gin.Context, *pg.DB), db *pg.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		handler(c, db)
	}
}

func main() {
	db := database.InitDB()
	r := gin.Default()

	r.POST("/user/register", wrapperDB(controllers.Register, db))
	r.POST("/user/login", wrapperDB(controllers.Login, db))
	r.GET("/user/profile", middlewares.CheckAuthorization, wrapperDB(controllers.GetProfile, db))
	r.GET("/users", wrapperDB(controllers.GetUsers, db))
	r.PATCH("/user/profile", middlewares.CheckAuthorization, wrapperDB(controllers.UpdateProfile, db))

	r.Run()
}
