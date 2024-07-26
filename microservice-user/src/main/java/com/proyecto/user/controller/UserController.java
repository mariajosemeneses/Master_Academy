package com.proyecto.user.controller;

import com.proyecto.user.client.http.request.LoginRequest;
import com.proyecto.user.client.http.response.AuthResponse;
import com.proyecto.user.entity.User;
import com.proyecto.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> saveUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.save(user));
    }

    @PutMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.update(user));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Long id) {
        userService.delete(id);
    }

    @GetMapping("/search-subscription/{userId}")
    public ResponseEntity<?> findAllSubscriptionByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.findAllSubscriptionByUserId(userId));
    }
    @GetMapping("/search-course-by-user/{userId}")
    public ResponseEntity<?> findAllCoursesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.findAllCourseByUserId(userId));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request)
    {
        System.out.println(request.getEmail()+" "+request.getPassword());
        return ResponseEntity.ok(userService.findByEmailAndPassword(request.getEmail(), request.getPassword()));
    }
    @GetMapping("/search-by-email/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.findByEmail(email));
    }

}
