package shopping.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopping.dao.ProductDao;
import shopping.dao.UserDao;
import shopping.dao.WatchlistDao;
import shopping.dto.ProductDto;
import shopping.exception.ResourceNotFoundException;
import shopping.entity.Product;
import shopping.entity.User;
import shopping.entity.Watchlist;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WatchlistService {

    private final WatchlistDao watchlistDao;
    private final UserDao userDao;
    private final ProductDao productDao;

    public WatchlistService(WatchlistDao watchlistDao, UserDao userDao, ProductDao productDao) {
        this.watchlistDao = watchlistDao;
        this.userDao = userDao;
        this.productDao = productDao;
    }

    public void addToWatchlist(Long userId, Long productId) {
        User user = userDao.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Product product = productDao.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        if (watchlistDao.findByUserIdAndProductId(userId, productId).isPresent()) {
            return;
        }

        Watchlist watchlist = new Watchlist(userId, productId);
        watchlist.setUser(user);
        watchlist.setProduct(product);
        watchlistDao.save(watchlist);
    }

    public void removeFromWatchlist(Long userId, Long productId) {
        Watchlist watchlist = watchlistDao.findByUserIdAndProductId(userId, productId).orElseThrow(()
                -> new ResourceNotFoundException("Watchlist item not found."));
        watchlistDao.delete(watchlist);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAllWatchlist(Long userId) {
        return watchlistDao.findByUserId(userId)
                .stream()
                .map(w -> toProductDto(w.getProduct()))
                .collect(Collectors.toList());
    }

    private ProductDto toProductDto(Product p) {
        return new ProductDto(p.getProductId(), p.getDescription(), p.getName(), p.getRetailPrice());
    }
}
