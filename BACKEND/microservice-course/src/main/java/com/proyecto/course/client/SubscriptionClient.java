package com.proyecto.course.client;

import com.proyecto.course.client.dto.SubscriptionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name="microservice-subscription", url = "localhost:8080/api/subscription")
public interface SubscriptionClient {

    @GetMapping("/search-by-course/{courseId}")
    List<SubscriptionDTO> findAllSubscriptionByCourseId(@PathVariable Long courseId);
}
