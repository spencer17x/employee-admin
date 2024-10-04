package database

import (
	"context"
	"fmt"
	"github.com/go-pg/pg/v10"
	"log"
	"server/config"
	"server/models"
	"sync"
)

var (
	dbInstance *pg.DB
	once       sync.Once
)

func InitDB() *pg.DB {
	once.Do(func() {
		if cfg, err := config.LoadConfig("config.yaml"); err != nil {
			log.Fatalf("Error loading config: %v", err)
		} else {
			dbInstance = pg.Connect(&pg.Options{
				User:     cfg.Database.User,
				Password: cfg.Database.Password,
				Database: cfg.Database.Name,
				Addr:     cfg.Database.Addr,
			})
		}

		ctx := context.Background()
		if err := dbInstance.Ping(ctx); err != nil {
			log.Fatalf("Error connecting to database: %v\n", err)
			return
		}
		fmt.Println("Connection to database successful.")

		if err := models.CreateSchema(dbInstance); err != nil {
			log.Fatalf("Error creating schema: %v\n", err)
			return
		}
		err := models.CreateSchema(dbInstance)
		if err != nil {
			log.Fatalf("Error creating schema: %v\n", err)
			return
		}
	})
	return dbInstance
}

func GetDB() *pg.DB {
	if dbInstance == nil {
		log.Fatalf("Database not initialized.")
	}
	return dbInstance
}
