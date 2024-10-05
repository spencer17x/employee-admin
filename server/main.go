package main

import (
	"github.com/gin-contrib/cors"
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
	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowMethods:    []string{"GET", "POST", "PATCH", "DELETE"},
		AllowHeaders:    []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
	}))

	r.POST("/api/sign-up", wrapperDB(controllers.SignUp, db))
	r.POST("/api/sign-in", wrapperDB(controllers.SignIn, db))
	r.GET("/api/user/profile", middlewares.CheckAuthorization, wrapperDB(controllers.GetProfile, db))
	r.GET("/api/users", wrapperDB(controllers.GetUsers, db))
	r.PATCH("/api/user/profile", middlewares.CheckAuthorization, wrapperDB(controllers.UpdateProfile, db))

	r.Run()
}
