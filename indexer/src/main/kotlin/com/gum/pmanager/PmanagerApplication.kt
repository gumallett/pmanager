package com.gum.pmanager

import org.springframework.boot.WebApplicationType
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

@SpringBootApplication
@ConfigurationPropertiesScan
class PmanagerApplication

fun main(args: Array<String>) {
	SpringApplicationBuilder(PmanagerApplication::class.java)
		.web(WebApplicationType.NONE)
		.run(*args)
}
