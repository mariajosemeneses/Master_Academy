package com.proyecto.course.controller;

import com.proyecto.course.entity.Course;
import com.proyecto.course.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequestMapping("/api/course")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/all")
    public ResponseEntity<?> findById() {
        return ResponseEntity.ok(courseService.findAll());
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.findById(id));
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> saveCourse(@RequestBody Course course) {
        return ResponseEntity.ok(courseService.save(course));
    }

    @PutMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> updateCourse(@RequestBody Course course) {
        return ResponseEntity.ok(courseService.update(course));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Long id) {
        courseService.delete(id);
    }

    @GetMapping("/searchCourses-by-user/{userId}")
    public ResponseEntity<?> findByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(courseService.findByUserId(userId));
    }

    @GetMapping("/search-subscription/{courseId}")
    public ResponseEntity<?> findAllSubscriptionByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(courseService.findAllSubscriptionByCourseId(courseId));
    }
}

