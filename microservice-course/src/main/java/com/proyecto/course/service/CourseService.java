package com.proyecto.course.service;

import com.proyecto.course.client.http.response.SubscriptionByCourseResponse;
import com.proyecto.course.entity.Course;

import java.util.List;

public interface CourseService {

    List<Course> findAll();

    Course findById(Long id);

    Course save(Course course);

    Course update(Course course);

    void delete(Long id);

    List<Course> findByUserId(Long userId);

    SubscriptionByCourseResponse findAllSubscriptionByCourseId(Long courseId);

}
