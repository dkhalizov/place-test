package main

import (
	"github.com/gin-gonic/gin"
)

func registerRoutes(router *gin.Engine) {
	router.POST("/google", googleSignIn)
	router.GET("/verify", verifyToken)
	router.GET("/validate_token", validateToken)
}
