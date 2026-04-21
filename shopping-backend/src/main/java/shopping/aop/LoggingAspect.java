package shopping.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);
    private static final String POINTCUT = "execution(* shopping.controller.*.*(..)) || " + "execution(* shopping.service.*.*(..))";

    @Before(POINTCUT)
    public void logBefore(JoinPoint joinPoint) {
        log.info("Entering: {}", joinPoint.getSignature().toShortString());
    }

    @AfterReturning(pointcut = POINTCUT, returning = "result")
    public void logAfter(JoinPoint joinPoint) {
        log.info("Completed: {}", joinPoint.getSignature().toShortString());
    }

    @AfterThrowing(pointcut = POINTCUT, throwing = "ex")
    public void logError(JoinPoint joinPoint, Exception ex) {
        log.error("Error in: {} | Exception: {}",
                joinPoint.getSignature().toShortString(),
                ex.getMessage());
    }
}
