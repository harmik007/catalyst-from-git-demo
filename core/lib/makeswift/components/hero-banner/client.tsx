import Image from 'next/image';
import { Button } from '@/vibes/soul/primitives/button';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';

interface MSHeroBannerProps {
  readonly className?: string;
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly width?: number;
    readonly height?: number;
  };
  readonly heading: string;
  readonly text: string;
  readonly button: {
    readonly text: string;
    readonly href?: string;
    readonly variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  };
  readonly layout?: 'left' | 'center' | 'right';
}

export function MSHeroBanner({
  className = '',
  image,
  heading,
  text,
  button,
  layout = 'left',
}: MSHeroBannerProps) {
  const layoutClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const contentAlignment = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  };

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div className="relative min-h-[400px] w-full">
        {/* Background Image */}
        {image.src && (
          <div className="absolute inset-0">
            <Image
              src={image.src}
              alt={image.alt || 'Hero banner image'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex min-h-[400px] w-full items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className={`max-w-4xl space-y-6 ${contentAlignment[layout]}`}>
            {/* Heading */}
            {heading && (
              <h1 className={`text-3xl font-bold text-white sm:text-4xl lg:text-5xl ${layoutClasses[layout]}`}>
                {heading}
              </h1>
            )}

            {/* Text */}
            {text && (
              <p className={`text-lg text-white/90 sm:text-xl ${layoutClasses[layout]}`}>
                {text}
              </p>
            )}

            {/* Button */}
            {button.text && (
              <div className={layoutClasses[layout]}>
                {button.href ? (
                  <ButtonLink
                    href={button.href}
                    variant={button.variant || 'primary'}
                    size="large"
                    className="inline-flex"
                  >
                    {button.text}
                  </ButtonLink>
                ) : (
                  <Button
                    variant={button.variant || 'primary'}
                    size="large"
                    className="inline-flex"
                  >
                    {button.text}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
