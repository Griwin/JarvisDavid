<?php

namespace App\Enum;

enum AiRequestType: string
{
    case TRANSLATE = 'translate';
    case SUMMARIZE = 'summarize';
    case PDF_SUMMARY = 'pdf_summary';
}
