package com.proyecto.course.client.http.response;

import com.proyecto.course.client.dto.SubscriptionDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscriptionByCourseResponse {

    private String name;
    private String status;
    private String description;
    private List<SubscriptionDTO> subscriptionDTOList;

}
