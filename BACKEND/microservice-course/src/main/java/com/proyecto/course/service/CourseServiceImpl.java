package com.proyecto.course.service;


import com.proyecto.course.client.SubscriptionClient;
import com.proyecto.course.client.dto.SubscriptionDTO;
import com.proyecto.course.client.http.response.SubscriptionByCourseResponse;
import com.proyecto.course.entity.Course;
import com.proyecto.course.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private SubscriptionClient subscriptionClient;

    @Override
    public List<Course> findAll() {
        return courseRepository.findAll();
    }

    @Override
    public Course findById(Long id) {
        return courseRepository.findById(id).orElseThrow();
    }

    @Override
    public Course save(Course subscription) {
        return courseRepository.save(subscription);
    }

    @Override
    public Course update(Course course) {
        Course courseOld = courseRepository.findById(course.getId()).orElse(null);

        if (courseOld != null) {
            if (course.getUserId() != null) {
                courseOld.setUserId(course.getUserId());
            }
            if (course.getName() != null) {
                courseOld.setName(course.getName());
            }
            if (course.getStatus() != null) {
                courseOld.setStatus(course.getStatus());
            }
            if (course.getDescription() != null) {
                courseOld.setDescription(course.getDescription());
            }
            return courseRepository.save(courseOld);
        }
        else {
            return null;
        }
    }

    @Override
    public void delete(Long id) {
        courseRepository.deleteById(id);
    }

    @Override
    public List<Course> findByUserId(Long userId) {
        return courseRepository.findAllByUserId(userId);
    }

    @Override
    public SubscriptionByCourseResponse findAllSubscriptionByCourseId(Long courseId) {
        // Consultar usuario
        Course course = courseRepository.findById(courseId).orElse(new Course());

        // Obtener subscriptions
        List<SubscriptionDTO> subscriptionDTOList = subscriptionClient.findAllSubscriptionByCourseId(courseId);
        return SubscriptionByCourseResponse.builder()
                .name(course.getName())
                .status(course.getStatus())
                .description(course.getDescription())
                .subscriptionDTOList(subscriptionDTOList)
                .build();
    }


}
