package com.proyecto.subscription.client;

import com.proyecto.subscription.client.dto.CourseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(name = "microservice-course", url = "localhost:8080/api/course")
public interface CourseClient {
    @GetMapping("/search/{id}")
    CourseDTO findCouseById(@PathVariable Long id);
}





