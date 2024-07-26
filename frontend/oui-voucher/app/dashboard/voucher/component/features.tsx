import { FeatureCard } from "@/app/page";
import { EyeIcon } from "@heroicons/react/outline";
import { DownloadIcon } from "@heroicons/react/outline";
import { SelectorIcon } from "@heroicons/react/outline";
import { ClipboardListIcon } from "@heroicons/react/outline";
import { ArchiveIcon } from "@heroicons/react/outline";
import { TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/outline";
import { OnlinePredictionRounded } from "@mui/icons-material";
import { ScrollShadow } from "@nextui-org/react";

export function FeaturesSection() {
  const features = [
    {
      title: "Make Payement",
      description: "Create new vouchers easily for payments.",
      icon: <PlusIcon className="w-12 h-12" />,
      link: "/dashboard/voucher/new",
    },

    // {
    //   title: "View Approved Vouchers",
    //   description: "Check the status of used vouchers.",
    //   icon: <EyeIcon className="w-12 h-12" />,
    //   link: "/dashboard/voucher/manage",
    // },
    {
      title: "Generate PDF Invoice",
      description: "Create and download PDF invoices.",
      icon: <DownloadIcon className="w-12 h-12" />,
      link: "/dashboard/voucher/manage",
    },
  ];

  return (
    <div
      className="py-10 bg-gray-100 rounded-md dark:bg-gray-900"
      id="features"
    >
      <h2 className="mb-8 text-3xl font-bold text-center dark:text-white">
        Features
      </h2>
      <ScrollShadow
        hideScrollBar
        className="w-full lg:max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 justify-center h-[59vh]"
      >
        {features.map((feature, index) => (
          <a href={feature.link}>
            <FeatureCard
              link={feature.link}
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          </a>
        ))}
      </ScrollShadow>
    </div>
  );
}
