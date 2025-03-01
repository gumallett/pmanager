package com.gum.pmanager.controller

import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler


@ControllerAdvice
class RestResponseEntityExceptionHandler : ResponseEntityExceptionHandler() {
    private val LOG = LoggerFactory.getLogger(RestResponseEntityExceptionHandler::class.java)

    @ExceptionHandler(value = [IllegalStateException::class])
    protected fun handleConflict(
        ex: RuntimeException?, request: WebRequest?
    ): ResponseEntity<Any>? {
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

    @ExceptionHandler(value = [DataIntegrityViolationException::class])
    protected fun handleDataIntegrityViolation(ex: DataIntegrityViolationException?, request: WebRequest?): ResponseEntity<Any>? {
        LOG.warn("Uncaught data integrity violation error", ex)
        if (ex?.rootCause?.message?.contains("duplicate key", true) == true) {
            return handleExceptionInternal(ex, "Bad request", HttpHeaders(), HttpStatus.BAD_REQUEST, request!!)
        }

        return handleExceptionInternal(ex!!, "Server error", HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request!!)
    }
}

class VideoNotFoundException(msg: String) : RuntimeException(msg)
