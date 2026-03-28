import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { ProductDetailMedia as ProductDetailMediaConfig } from "../../data/product-detail-blueprints";
import { ProductDetailMedia } from "./ProductDetailMedia";
import { ProductSectionIntro } from "./ProductDetailPrimitives";

export function ProductFullBleedReveal({
  title,
  body,
  media,
}: {
  title: string;
  body: string;
  media: ProductDetailMediaConfig;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0.2, 0.72], [0.86, 1]);
  const radius = useTransform(scrollYProgress, [0.2, 0.72], [32, 0]);
  const translateY = useTransform(scrollYProgress, [0.15, 0.72], [48, 0]);

  return (
    <section ref={ref} className="relative h-[160vh]">
      <div className="sticky top-20">
        <div className="mx-auto max-w-[58rem] px-4 pt-10 text-center md:px-8 md:pt-14">
          <ProductSectionIntro title={title} body={body} align="center" />
        </div>

        <div className="mt-10 flex justify-center pb-8 md:mt-14">
          <motion.div
            style={{ scale, borderRadius: radius, y: translateY }}
            className="w-screen overflow-hidden border border-zinc-200 bg-[#f5f4f1] shadow-[0_40px_100px_rgba(15,23,42,0.1)] dark:border-zinc-800/60 dark:bg-black dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
          >
            <div className="aspect-[16/9] min-h-[22rem] md:min-h-[34rem]">
              <ProductDetailMedia media={media} className="size-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
