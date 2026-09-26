<?php

declare(strict_types=1);

namespace App\Tests\Service\Summarization;

use App\Service\Summarization\OllamaTextSummarizer;
use App\Service\Summarization\SummarizationException;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;

final class OllamaTextSummarizerTest extends TestCase
{
    public function testItReturnsOllamaSummary(): void
    {
        $client = new MockHttpClient(function (string $method, string $url, array $options): MockResponse {
            self::assertSame('POST', $method);
            self::assertSame('http://ollama:11434/api/chat', $url);
            self::assertStringContainsString('Un texte suffisamment long', $options['body']);
            self::assertStringContainsString('"think":false', $options['body']);

            return new MockResponse(json_encode([
                'message' => ['content' => 'Voici le résumé.'],
            ], JSON_THROW_ON_ERROR));
        });

        $summarizer = new OllamaTextSummarizer($client, 'http://ollama:11434', 'gemma3:12b');

        self::assertSame('Voici le résumé.', $summarizer->summarize('Un texte suffisamment long à résumer.'));
    }

    public function testItRejectsAnEmptyModelResponse(): void
    {
        $client = new MockHttpClient(new MockResponse(json_encode([
            'message' => ['content' => ''],
        ], JSON_THROW_ON_ERROR)));

        $summarizer = new OllamaTextSummarizer($client, 'http://ollama:11434', 'gemma3:12b');

        $this->expectException(SummarizationException::class);
        $summarizer->summarize('Un texte suffisamment long à résumer.');
    }
}
