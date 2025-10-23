# ====== Build stage ======
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# copy pom + download deps trước (tối ưu cache)
COPY pom.xml ./
RUN mvn -q -e -DskipTests dependency:go-offline

# copy source và build
COPY src ./src
RUN mvn -q -DskipTests package

# ====== Runtime stage ======
FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app

# timezone (optional)
RUN apk add --no-cache tzdata && ln -snf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime

# copy fat-jar (spring-boot-maven-plugin sẽ tạo 1 jar duy nhất)
COPY --from=build /app/target/*.jar /app/app.jar

# Cổng ứng dụng
EXPOSE 8080

# Có thể override profile khi chạy container
ENV SPRING_PROFILES_ACTIVE=prod
# Tinh chỉnh JVM cho container
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"

# Chạy app
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE} -jar /app/app.jar"]
