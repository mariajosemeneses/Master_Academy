package com.proyecto.subscription.controller;

import com.proyecto.subscription.entity.Subscription;
import com.proyecto.subscription.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/subscription")

public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @GetMapping("/all")
    public ResponseEntity<?> findById() {
        return ResponseEntity.ok(subscriptionService.findAll());
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.findById(id));
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> saveSubscription(@RequestBody Subscription subscription) {
        return ResponseEntity.ok(subscriptionService.save(subscription));
    }

    @PutMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> updateSubscription(@RequestBody Subscription subscription) {
        return ResponseEntity.ok(subscriptionService.update(subscription));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Long id) {
        subscriptionService.delete(id);
    }

    @GetMapping("/search-by-course/{courseId}")
    public ResponseEntity<?> findByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(subscriptionService.findByCourseId(courseId));
    }

    @GetMapping("/search-by-user/{userId}")
    public ResponseEntity<?> findByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.findByUserId(userId));
    }

    @GetMapping("/search-subscription-with-course-by-user/{userId}")
    public ResponseEntity<?> findAllByUserIdWithCourseCreator(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.findAllByUserIdWithCourseCreator(userId));
    }
}
