package shopping.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shopping.dto.*;
import shopping.service.AdminOrderService;
import shopping.service.AdminStatsService;

import java.util.List;

@RestController
@RequestMapping
public class AdminController {

    private final AdminOrderService adminOrderService;
    private final AdminStatsService adminStatsService;

    public AdminController(AdminOrderService adminOrderService, AdminStatsService adminStatsService) {
        this.adminOrderService = adminOrderService;
        this.adminStatsService = adminStatsService;
    }

    @PatchMapping("/orders/{orderId}/complete")
    public ResponseEntity<AdminOrderDto> completeOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(adminOrderService.completeOrder(orderId));
    }

    @GetMapping("/products/popular/{x}")
    public ResponseEntity<List<PopularProductDto>> getMostPopularProduct(@PathVariable int x) {
        return ResponseEntity.ok(adminStatsService.getMostPopularProduct(x));
    }

    @GetMapping("/products/profit/{x}")
    public ResponseEntity<List<ProductProfitDto>> getMostProfitableProduct(@PathVariable int x) {
        return ResponseEntity.ok(adminStatsService.getMostProfitableProduct(x));
    }
}
