package com.proyecto.subscription.service;

import com.proyecto.subscription.client.CourseClient;
import com.proyecto.subscription.client.dto.CourseDTO;
import com.proyecto.subscription.client.http.response.SubscriptionsWithCoursesResponse;
import com.proyecto.subscription.entity.Subscription;
import com.proyecto.subscription.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private CourseClient courseClient;

    @Override
    public List<Subscription> findAll() {
        return subscriptionRepository.findAll();
    }

    @Override
    public Subscription findById(Long id) {
        return subscriptionRepository.findById(id).orElseThrow();
    }

    @Override
    public Subscription save(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }

    @Override
    public Subscription update(Subscription subscription) {
        Subscription subscriptionOld = subscriptionRepository.findById(subscription.getId()).orElse(null);
        if (subscriptionOld != null) {
            if (subscription.getUserId() != null) {
                subscriptionOld.setUserId(subscription.getUserId());
            }
            if (subscription.getCourseId() != null) {
                subscriptionOld.setCourseId(subscription.getCourseId());
            }
            if (subscription.getStatus() != null) {
                subscriptionOld.setStatus(subscription.getStatus());
            }
            if (subscription.getSubscriptionDate() != null) {
                subscriptionOld.setSubscriptionDate(subscription.getSubscriptionDate());
            }

            return subscriptionRepository.save(subscriptionOld);
        } else {
            return null;
        }

    }

    @Override
    public void delete(Long id) {
        subscriptionRepository.deleteById(id);
    }

    @Override
    public List<Subscription> findByCourseId(Long courseId) {
        return subscriptionRepository.findAllByCourseId(courseId);
    }

    @Override
    public List<Subscription> findByUserId(Long userId) {
        return subscriptionRepository.findAllByUserId(userId);
    }

    @Override
    public List<SubscriptionsWithCoursesResponse> findAllByUserIdWithCourseCreator(Long userId) {
        List<Subscription> subscriptions = subscriptionRepository.findAllByUserId(userId);

        List<SubscriptionsWithCoursesResponse> subscriptionsWithCoursesResponses = subscriptions.stream().map(subscription -> {
            SubscriptionsWithCoursesResponse subscriptionsWithCoursesResponse = new SubscriptionsWithCoursesResponse();

            subscriptionsWithCoursesResponse.setId(subscription.getId());
            subscriptionsWithCoursesResponse.setUserId(subscription.getUserId());
            subscriptionsWithCoursesResponse.setCourseId(subscription.getCourseId());
            subscriptionsWithCoursesResponse.setStatus(subscription.getStatus());
            subscriptionsWithCoursesResponse.setSubscriptionDate(subscription.getSubscriptionDate());

            CourseDTO course = courseClient.findCouseById(subscription.getCourseId());

            subscriptionsWithCoursesResponse.setCreatorId(course.getUserId());
            subscriptionsWithCoursesResponse.setCourseName(course.getName());
            return subscriptionsWithCoursesResponse;
        }).toList();

        // Calcula el número de veces que aparece cada status
        Map<String, Long> statusCountMap = subscriptions.stream()
                .collect(Collectors.groupingBy(Subscription::getStatus, Collectors.counting()));

        // Actualiza el atributo statusCount en cada respuesta con el conteo correspondiente
        subscriptionsWithCoursesResponses.forEach(response -> {
            String status = response.getStatus();
            if (status != null && statusCountMap.containsKey(status)) {
                response.setStatusCount(statusCountMap.get(status).intValue());
            } else {
                response.setStatusCount(0);
            }
        });

        return subscriptionsWithCoursesResponses;
    }
}
