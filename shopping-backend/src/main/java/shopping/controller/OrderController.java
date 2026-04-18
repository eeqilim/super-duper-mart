package shopping.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import shopping.dto.OrderDto;
import shopping.dto.PlaceOrderRequest;
import shopping.service.OrderService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderDto> placeOrder(@Valid @RequestBody PlaceOrderRequest request, Authentication auth) {
        Long userId = extractUserId(auth);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.placeOrder(userId, request.getItems()));
    }

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(@PathVariable Long orderId, Authentication auth) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(orderService.cancelOrder(orderId, userId));
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getMyOrders(Authentication auth) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId, Authentication auth) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(orderService.getOrderById(orderId, userId));
    }

    private Long extractUserId(Authentication auth) {
        return Long.valueOf(auth.getName());
    }
}
