package com.gum.pmanager.controller

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler


@ControllerAdvice
class RestResponseEntityExceptionHandler : ResponseEntityExceptionHandler() {
    @ExceptionHandler(value = [IllegalStateException::class])
    protected fun handleConflict(
        ex: RuntimeException?, request: WebRequest?
    ): ResponseEntity<Any> {
        val bodyOfResponse = "Conflict"
        return handleExceptionInternal(
            ex!!, bodyOfResponse,
            HttpHeaders(), HttpStatus.CONFLICT, request!!
        )
    }

    @ExceptionHandler(value = [VideoNotFoundException::class])
    protected fun handleNotFound(
        ex: VideoNotFoundException?, request: WebRequest?
    ) = handleExceptionInternal(ex!!, "Not found", HttpHeaders(), HttpStatus.NOT_FOUND, request!!)
}

class VideoNotFoundException(msg: String) : RuntimeException(msg)
