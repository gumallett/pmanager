package com.gum.pmanager

import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.util.TestPropertyValues
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.test.context.ContextConfiguration
import org.testcontainers.containers.PostgreSQLContainer

@SpringBootTest
@ContextConfiguration(initializers = [IntTest.Initializer::class])
class IntTest {
    companion object {
        val postgres = PostgreSQLContainer("postgres:13")
            .withUsername("postgres")
            .withPassword("postgres")
    }

    internal class Initializer : ApplicationContextInitializer<ConfigurableApplicationContext> {
        override fun initialize(configurableApplicationContext: ConfigurableApplicationContext) {
            postgres.start()

            TestPropertyValues.of(
                "spring.datasource.url=${postgres.jdbcUrl}",
            ).applyTo(configurableApplicationContext.environment)
        }
    }
}
