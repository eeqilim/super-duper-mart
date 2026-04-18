package shopping.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import shopping.dto.ProductDto;
import shopping.service.WatchlistService;

import java.util.List;

@RestController
@RequestMapping("/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getWatchlist(Authentication auth) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(watchlistService.getAllWatchlistByUserId(userId));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> addToWatchlist(@PathVariable Long productId, Authentication auth) {
        Long userId = extractUserId(auth);
        watchlistService.addToWatchlist(userId, productId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWatchlist(@PathVariable Long productId, Authentication auth) {
        Long userId = extractUserId(auth);
        watchlistService.removeFromWatchlist(userId, productId);
        return ResponseEntity.noContent().build();
    }

    private Long extractUserId(Authentication auth) {
        return Long.valueOf(auth.getName());
    }
}
