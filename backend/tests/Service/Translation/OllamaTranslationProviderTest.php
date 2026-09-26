<?php

declare(strict_types=1);

namespace App\Tests\Service\Translation;

use App\Service\Translation\OllamaTranslationProvider;
use App\Service\Translation\TranslationException;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;

final class OllamaTranslationProviderTest extends TestCase
{
    public function testItReturnsOllamaTranslation(): void
    {
        $client = new MockHttpClient(function (string $method, string $url, array $options): MockResponse {
            self::assertSame('POST', $method);
            self::assertSame('http://ollama:11434/api/chat', $url);
            self::assertStringContainsString('Bonjour', $options['body']);

            return new MockResponse(json_encode([
                'message' => ['content' => 'Hello'],
            ], JSON_THROW_ON_ERROR));
        });

        $provider = new OllamaTranslationProvider($client, 'http://ollama:11434', 'qwen2.5:3b');

        self::assertSame('Hello', $provider->translate('Bonjour', 'fr', 'en', 'natural'));
    }

    public function testItRejectsAnEmptyModelResponse(): void
    {
        $client = new MockHttpClient(new MockResponse(json_encode([
            'message' => ['content' => '  '],
        ], JSON_THROW_ON_ERROR)));

        $provider = new OllamaTranslationProvider($client, 'http://ollama:11434', 'qwen2.5:3b');

        $this->expectException(TranslationException::class);
        $provider->translate('Bonjour', 'fr', 'en', 'natural');
    }
}
