package com.proyecto.user.client;

import com.proyecto.user.client.dto.CourseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "microservice-course", url = "localhost:8083/api/course/")
public interface CourseClient {
    @GetMapping("/searchCourses-by-user/{userId}")
    List<CourseDTO> findAllCoursesByUser(@PathVariable Long userId);
}





