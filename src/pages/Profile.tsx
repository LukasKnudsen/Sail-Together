import SuitcaseIcon from "@/components/icons/SuitcaseIcon";
import CalendarDaysIcon from "@/components/icons/CalendarDaysIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Container } from "@/components/ui/container";
import { Rating } from "@/components/ui/rating";
import { getUserProfile } from "@/data/user";
import { Navigate } from "react-router-dom";
import { format } from "date-fns";
import LocationPin from "@/components/icons/LocationPin";
import { ContactActions } from "@/components/ui/contact-actions";
import IconMedal from "@/components/icons/IconMedal";
import VesselIcon from "@/components/icons/VesselIcon";
import GlobeIcon from "@/components/icons/GlobeIcon";
import { Media, MediaFallback } from "@/components/ui/media";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const userProfile = getUserProfile();
  const {
    avatarUrl,
    name,
    rating,
    role,
    joinedDate,
    location,
    email,
    phone,
    about,
    qualifications,
    skills,
    feedback,
    experiences,
  } = userProfile;

  if (!userProfile) return <Navigate to="/404" replace />;

  return (
    <Container className="container mx-auto max-w-3xl p-2">
      <article className="flex flex-col gap-6 [&>section]:space-y-2">
        <header className="flex flex-col items-center gap-2 [&>p]:flex [&>p]:items-center [&>p]:gap-2 [&>p]:font-semibold">
          <Avatar className="size-24 rounded-3xl bg-[#FFC7D6]">
            <AvatarImage src={avatarUrl} alt="User Avatar" />
            <AvatarFallback>CA</AvatarFallback>
          </Avatar>

          <h1 id="profile-name" className="text-2xl font-bold">
            {name}
          </h1>
          {/* Edit Profile Button - matching Add Listing style */}
          <Button variant="secondary" onClick={() => navigate("/profile/edit")} className="mt-2">
            Edit Profile
          </Button>
          <div className="flex items-center gap-2">
            <Rating value={rating ?? 0} max={5} size={24} />
            <span className="sr-only">{rating} out of 5 stars</span>
          </div>

          <div className="flex gap-4 [&>p]:flex [&>p]:items-center [&>p]:gap-2 [&>p]:font-semibold">
            <p>
              <SuitcaseIcon className="size-6" /> {role}
            </p>
            <p>
              <CalendarDaysIcon className="size-6" /> Joined {format(joinedDate, "MMM yyyy")}
            </p>
          </div>
          <p>
            <LocationPin className="size-6" /> {location}
          </p>

          <ContactActions email={email} phone={phone} />
        </header>

        <section>
          <h2 className="text-xl font-semibold">About Me</h2>
          <p>{about}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Experience Log</h2>
          <ul className="flex list-none flex-col gap-4">
            {experiences?.map((experience) => (
              <li key={experience.id} className="flex flex-row gap-4 rounded-2xl">
                <Media className="size-24 rounded-3xl">
                  {/*Use img src from database*/}
                  {/*<MediaImage src={experience.image} alt={experience.title} />*/}
                  <MediaFallback className="bg-neutral-300" />
                </Media>
                <div className="flex flex-col justify-between [&>p]:flex [&>p]:items-center [&>p]:gap-2 [&>p]:text-sm [&>p]:font-medium">
                  <h3 className="font-medium">{experience.title}</h3>
                  <p>
                    <GlobeIcon className="size-5" /> {experience.location}
                  </p>
                  <p>
                    <VesselIcon className="size-5" /> {experience.vessel}
                  </p>
                  <p>
                    <CalendarDaysIcon className="size-5" /> {format(experience.date, "MMM yyyy")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Qualifications</h2>
          <ul className="grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-2">
            {qualifications?.map((qualification) => (
              <li key={qualification.id} className="flex items-start gap-2 font-medium">
                <IconMedal aria-hidden="true" className="size-6 shrink-0 text-blue-500" />
                {qualification.name}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Skills</h2>
          <ul className="flex flex-wrap gap-2">
            {skills?.map((skill, index) => (
              <li
                key={`skill-${index}`}
                className="bg-muted text-muted-foregroundpx-2 inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Feedback</h2>
          <ul className="flex flex-wrap gap-2">
            {feedback?.map((f) => (
              <li key={f.id} className="bg-muted w-full rounded-2xl p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="leading-none font-semibold">{f.author.name ?? "Anonymous"}</p>
                  {f.createdAt && (
                    <time
                      className="text-muted-foreground text-xs font-medium"
                      dateTime={f?.createdAt?.toString() ?? ""}
                    >
                      {format(new Date(f.createdAt), "MMM d, yyyy")}
                    </time>
                  )}
                </div>

                <p className="text-muted-foreground mt-2 line-clamp-4 text-sm leading-relaxed">
                  {f.comment}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </Container>
  );
}
