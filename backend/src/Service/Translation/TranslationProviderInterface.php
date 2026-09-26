<?php

declare(strict_types=1);

namespace App\Service\Translation;

interface TranslationProviderInterface
{
    public function translate(
        string $text,
        string $sourceLanguage,
        string $targetLanguage,
        string $tone,
    ): string;
}
