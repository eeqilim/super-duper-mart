package shopping.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import shopping.dto.OrderDto;
import shopping.dto.PlaceOrderRequest;
import shopping.service.AdminOrderService;
import shopping.service.OrderService;

import javax.validation.Valid;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final AdminOrderService adminOrderService;

    public OrderController(OrderService orderService, AdminOrderService adminOrderService) {
        this.orderService = orderService;
        this.adminOrderService = adminOrderService;
    }

    @PostMapping
    public ResponseEntity<OrderDto> placeNewOrder(@Valid @RequestBody PlaceOrderRequest request, Authentication auth) {
        Long userId = extractUserId(auth);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.placeOrder(userId, request.getOrder()));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders(Authentication auth) {
        if (isAdmin(auth)) {
            return ResponseEntity.ok(adminOrderService.getAllOrdersForAdmin());
        }

        Long userId = extractUserId(auth);
        return ResponseEntity.ok(orderService.getAllOrdersByUserId(userId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetail(@PathVariable Long orderId, Authentication auth) {
        if (isAdmin(auth)) {
            return ResponseEntity.ok(adminOrderService.getOrderDetail(orderId));
        }

        Long userId = extractUserId(auth);
        return ResponseEntity.ok(orderService.getOrderDetail(orderId, userId));
    }

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId, Authentication auth) {
        if (isAdmin(auth)) {
            return ResponseEntity.ok(adminOrderService.cancelOrder(orderId));
        }

        Long userId = extractUserId(auth);
        return ResponseEntity.ok(orderService.cancelOrder(orderId, userId));
    }

    private Long extractUserId(Authentication auth) {
        return Long.valueOf(auth.getName());
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }
}
