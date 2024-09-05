package main

import (
	"fmt"
	"net/http"
	"runtime"
	"strings"
	"sync"
)

func main() {
	url := "http://localhost:8080/api/draw"
	numWorkers := runtime.NumCPU()
	var wg sync.WaitGroup
	tasks := make(chan [2]int, 500*500)

	worker := func(tasks <-chan [2]int, wg *sync.WaitGroup) {
		defer wg.Done()
		for task := range tasks {
			i, j := task[0], task[1]
			payload := strings.NewReader(fmt.Sprintf("{\"x\":%d,\"y\":%d,\"color\":5}", i, j))
			req, _ := http.NewRequest("POST", url, payload)
			req.Header.Add("Content-Type", "application/json")
			req.Header.Add("User-Agent", "insomnia/9.3.3")
			_, _ = http.DefaultClient.Do(req)
		}
	}

	for w := 0; w < numWorkers; w++ {
		wg.Add(1)
		go worker(tasks, &wg)
	}

	for i := 0; i < 500; i++ {
		for j := 0; j < 500; j++ {
			tasks <- [2]int{i, j}
		}
	}
	close(tasks)
	wg.Wait()
}
