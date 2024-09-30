package auth

import (
	"backend/auth/provider"
	"backend/web"
)

func Run() {
	instance := web.MakeServer(web.WithGinEngine(registerRoutes))
	RegisterProvider(provider.NewGoogle())
	RegisterProvider(provider.NewGitHub())

	instance.Run()
}
