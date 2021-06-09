package com.gum.pmanager.indexer

import com.drew.imaging.FileType
import com.drew.imaging.FileTypeDetector
import com.drew.imaging.avi.AviMetadataReader
import com.drew.imaging.mp4.Mp4MetadataReader
import com.drew.imaging.quicktime.QuickTimeMetadataReader
import com.drew.metadata.Metadata
import org.springframework.stereotype.Service
import java.io.BufferedInputStream
import java.io.File
import java.io.FilterInputStream

@Service
class VideoMetadataService {
    fun getMetadata(fis: FilterInputStream): Metadata? {
        return when (FileTypeDetector.detectFileType(fis)) {
            FileType.Mp4 -> Mp4MetadataReader.readMetadata(fis)
            FileType.QuickTime -> QuickTimeMetadataReader.readMetadata(fis)
            FileType.Avi -> AviMetadataReader.readMetadata(fis)
            FileType.Asf -> null
            FileType.Flv -> null
            FileType.Unknown -> null
            else -> null
        }
    }

    fun getMetadata(file: File): Metadata? = BufferedInputStream(file.inputStream()).use { fis -> getMetadata(fis)}
}

fun Metadata.allTags() = directories.flatMap { dir -> dir.tags }
fun Metadata.findTag(tagName: String) = allTags().firstOrNull { tag -> tag.tagName.equals(tagName, true) }
