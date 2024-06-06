alias Acl.Accessibility.Always, as: AlwaysAccessible
alias Acl.GraphSpec.Constraint.Resource, as: ResourceConstraint
alias Acl.GraphSpec, as: GraphSpec
alias Acl.GroupSpec, as: GroupSpec

defmodule Acl.UserGroups.Config do
  def user_groups do
    [
      # // PUBLIC
      %GroupSpec{
        name: "public",
        useage: [:read],
        access: %AlwaysAccessible{},
        graphs: [
          %GraphSpec{
            graph: "http://mu.semte.ch/graphs/public",
            constraint: %ResourceConstraint{
              resource_types: [
                "http://data.vlaanderen.be/ns/besluit#Besluit",
                "http://data.vlaanderen.be/ns/mandaat#Mandataris",
                "http://www.w3.org/ns/person#Person",
                "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#FileDataObject"
                ] } } ] },

      # # Allows access to generated delta files (and related files)
      %GroupSpec{
        name: "mandatees-decisions-deltas-r",
        useage: [ :read ],
        access: %AlwaysAccessible{},
        graphs: [ %GraphSpec{
                    graph: "http://redpencil.data.gift/id/deltas/mandatees-decisions/meta",
                    constraint: %ResourceConstraint{
                      resource_types: [
                        "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#FileDataObject",
                        "http://www.w3.org/ns/dcat#Dataset",
                        "http://www.w3.org/ns/dcat#Distribution",
                ] } } ] },

      # # Allows access jobs (meta) data, used by the jobs dashboard
      # Warning: CRUD'ing it is public now...
      %GroupSpec{
         name: "jobs-r",
         useage: [:read, :write, :read_for_write],
         access: %AlwaysAccessible{},
         graphs: [ %GraphSpec{
                     graph: "http://mu.semte.ch/graphs/jobs",
                     constraint: %ResourceConstraint{
                       resource_types: [
                         "http://lblod.data.gift/vocabularies/reporting/Report",
                         "http://vocab.deri.ie/cogs#Job",
                         "http://redpencil.data.gift/vocabularies/tasks/Task",
                         "http://open-services.net/ns/core#Error",
                         "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#DataContainer",
                         "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#FileDataObject",
                         "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#DataContainer"
                ] } } ] },
    ]
  end
end
