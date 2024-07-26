package com.proyecto.user.client;

import com.proyecto.user.client.dto.SubscriptionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name="microservice-subscription", url = "localhost:8080/api/subscription")
public interface SubscriptionClient {

    @GetMapping("/search-by-user/{userId}")
    List<SubscriptionDTO> findAllSubscriptionByUserId(@PathVariable Long userId);
}
