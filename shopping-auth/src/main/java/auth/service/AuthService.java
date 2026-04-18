package auth.service;

import auth.config.JwtProvider;
import auth.dao.UserDao;
import auth.dto.AuthResponse;
import auth.dto.LoginRequest;
import auth.dto.RegisterRequest;
import auth.dto.RegisterResponse;
import auth.exception.DuplicateUserException;
import auth.exception.InvalidCredentialsException;
import auth.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthService(UserDao userDao, PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    public RegisterResponse register(RegisterRequest request) {
        if (userDao.findByUsername(request.getUsername()).isPresent()) {
            throw new DuplicateUserException("Username already exists.");
        }

        if (userDao.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateUserException("Email already exists.");
        }

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(0);

        userDao.save(user);

        return new RegisterResponse(user.getUserId(), user.getUsername(), user.getEmail());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userDao.findByUsername(request.getUsername().trim())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password.");
        }

        String token = jwtProvider.generateToken(user);

        return new AuthResponse(token, user.getUsername(), user.getRole());
    }
}
