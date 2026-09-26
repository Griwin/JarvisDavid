<?php

declare(strict_types=1);

namespace App\Service\Summarization;

interface SummarizationProviderInterface
{
    public function summarize(string $text): string;
}
